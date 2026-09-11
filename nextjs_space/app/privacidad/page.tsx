import { LegalShell, LegalSection } from '@/components/legal/legal-shell'

export const metadata = {
  title: 'Política de privacidad — NiIdea',
  description: 'Política de privacidad y tratamiento de datos personales de NiIdea.',
}

export default function PrivacidadPage() {
  return (
    <LegalShell title="Política de privacidad" updated="31 de julio de 2026">
      <LegalSection heading="1. Responsable del tratamiento">
        <p>
          De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre,
          de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), le informamos de
          que los datos personales que nos facilite serán tratados por:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Responsable: <strong className="text-white">NiIdea</strong> — Almudena Morales Blanquer</li>
          <li>DNI: 05713431R</li>
          <li>Correo de contacto en materia de privacidad: <span suppressHydrationWarning>almublanq@gmail.com</span></li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. Datos que recopilamos">
        <p>Tratamos únicamente los datos necesarios para prestar el servicio:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Datos identificativos y de contacto: correo electrónico y número de teléfono móvil.</li>
          <li>Datos de la reserva: fecha elegida, número de personas y nivel de experiencia.</li>
          <li>Datos de pago: gestionados directamente por nuestra pasarela de pago; NiIdea no almacena los
            datos completos de tu tarjeta.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Finalidad y legitimación">
        <p>Tratamos tus datos con las siguientes finalidades y bases jurídicas:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Gestionar la compra y prestar la experiencia contratada, incluido el envío de los detalles el
            día de disfrute por WhatsApp — base: ejecución del contrato.</li>
          <li>Atender consultas y solicitudes — base: interés legítimo.</li>
          <li>Cumplir obligaciones legales, fiscales y contables — base: obligación legal.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Comunicación por WhatsApp">
        <p>
          Al facilitar tu número de móvil aceptas expresamente recibir por WhatsApp la información relativa
          a tu experiencia (confirmación, ubicación y detalles el día del plan). Este canal se utiliza
          exclusivamente para la gestión de tu reserva y no para envíos comerciales no solicitados.
        </p>
      </LegalSection>

      <LegalSection heading="5. Destinatarios y encargados de tratamiento">
        <p>
          Tus datos podrán ser comunicados a proveedores que prestan servicios a NiIdea (pasarela de pago,
          proveedor de mensajería WhatsApp y alojamiento del sitio web), siempre bajo el correspondiente
          contrato de encargo de tratamiento y con las garantías exigidas por el RGPD. No se realizan cesiones
          a terceros salvo obligación legal.
        </p>
      </LegalSection>

      <LegalSection heading="6. Conservación de los datos">
        <p>
          Conservaremos tus datos durante el tiempo necesario para prestar el servicio y, posteriormente,
          durante los plazos legalmente exigidos para atender posibles responsabilidades (en particular, los
          plazos fiscales y mercantiles aplicables).
        </p>
      </LegalSection>

      <LegalSection heading="7. Tus derechos">
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del
          tratamiento y portabilidad dirigiéndote a privacidad@niidea.es, indicando el derecho que deseas
          ejercer. Asimismo, tienes derecho a presentar una reclamación ante la Agencia Española de
          Protección de Datos (www.aepd.es) si consideras que el tratamiento no se ajusta a la normativa.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
