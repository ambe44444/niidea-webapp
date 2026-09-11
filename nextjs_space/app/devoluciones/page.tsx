import { LegalShell, LegalSection } from '@/components/legal/legal-shell'

export const metadata = {
  title: 'Política de devoluciones — NiIdea',
  description: 'Política de devoluciones de NiIdea: sin reembolso de dinero, cambio por otra experiencia.',
}

export default function DevolucionesPage() {
  return (
    <LegalShell title="Política de devoluciones" updated="12 de agosto de 2026">
      <LegalSection heading="1. Sin reembolso del importe pagado">
        <p>
          <strong className="text-white">
            NiIdea no realiza devoluciones de dinero en ningún caso.
          </strong>{' '}
          Una vez confirmada y pagada la compra de una experiencia, el importe abonado no será reembolsado,
          total ni parcialmente. En lugar de la devolución del dinero, el cliente podrá{' '}
          <strong className="text-white">cambiar su compra por otra experiencia</strong> de valor equivalente,
          en las condiciones que se detallan a continuación.
        </p>
      </LegalSection>

      <LegalSection heading="2. Cambio por otra experiencia">
        <p>
          Si no puedes disfrutar de tu experiencia, ofrecemos la posibilidad de cambiarla por otra de igual o
          equivalente valor. Para ello:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Debes solicitar el cambio con una antelación mínima de 24 horas respecto a la fecha reservada.</li>
          <li>El cambio está sujeto a disponibilidad de fechas.</li>
          <li>Si la nueva experiencia tiene un precio superior, deberás abonar la diferencia. Si tiene un
            precio inferior, no se reembolsará la diferencia (podrá quedar como crédito).</li>
          <li>El importe pagado se mantiene como crédito a tu favor, canjeable por una experiencia NiIdea.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Cambio de fecha">
        <p>
          Si finalmente no puedes acudir el día reservado,{' '}
          <strong className="text-white">puedes cambiar la fecha de tu experiencia</strong> sin coste
          adicional, siempre que lo comuniques con una antelación mínima de 24 horas respecto a la fecha
          reservada.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>El cambio de fecha se solicita escribiendo a almublanq@gmail.com y está sujeto a disponibilidad.</li>
          <li>Se admite un cambio de fecha por compra. Cambios adicionales quedan a criterio de NiIdea.</li>
          <li>
            Si la comunicación se realiza con menos de 24 horas de antelación, o si el cliente no se presenta
            el día reservado, se considerará la experiencia como disfrutada y no habrá derecho a cambio de
            fecha, a cambio por otra experiencia ni a reembolso.
          </li>
          <li>
            El plan asignado para la nueva fecha puede ser distinto del que estaba previsto: al ser una
            experiencia sorpresa, no se garantiza el mismo plan.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Naturaleza del servicio y derecho de desistimiento">
        <p>
          Conforme al artículo 103 del Real Decreto Legislativo 1/2007, por el que se aprueba el texto
          refundido de la Ley General para la Defensa de los Consumidores y Usuarios, el derecho de
          desistimiento no resulta aplicable a los contratos de prestación de servicios relacionados con
          actividades de ocio cuando el contrato prevea una fecha o periodo de ejecución específicos. Dado que
          las experiencias de NiIdea se contratan para una fecha concreta, no existe derecho de desistimiento
          con reembolso del importe.
        </p>
      </LegalSection>

      <LegalSection heading="5. Cancelación por parte de NiIdea">
        <p>
          En el supuesto excepcional de que NiIdea no pudiera prestar la experiencia por causas que le sean
          imputables, el cliente tendrá derecho a un cambio por otra experiencia equivalente o a mantener el
          importe como crédito íntegro para una futura reserva, sin coste adicional.
        </p>
      </LegalSection>

      <LegalSection heading="6. Cómo solicitar un cambio">
        <p>
          Para solicitar un cambio de fecha o de experiencia, escríbenos a almublanq@gmail.com indicando el correo y el teléfono con los que
          realizaste la compra y la fecha reservada. Te confirmaremos la disponibilidad y gestionaremos el
          cambio a la mayor brevedad.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
